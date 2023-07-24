import { Component, OnInit, Inject } from '@angular/core';
import { TransactionService } from '../services/transaction.service'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-category-dialog',
  templateUrl: './add-category-dialog.component.html',
  styleUrls: ['./add-category-dialog.component.scss']
})
export class AddCategoryDialogComponent implements OnInit {

  items: any;
  itemsAssets!: any[];
  idTransaction!: number;
  stringValue: any;
  numericValue: number;
  dataArray!: any[];
  nameCodeCategory: any
  TcodeCategory:any;
  constructor(
    public dialogRef: MatDialogRef<AddCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { items: any,code:any },
    private transactionService: TransactionService,
    private http: HttpClient
  ) {
    this.TcodeCategory=data.code;
    this.items = data.items;
console.log("data")
console.log(this.items)
    this.idTransaction = this.items.id

    this.stringValue = this.items.amount;
    this.numericValue = parseFloat(this.stringValue.split('€')[1].trim());

    console.log(this.numericValue)
  }

  ngOnInit(): void {
    this.loadCategories();
  }
  //categories
  public transactions: { category: string, subcategory: string, input: string }[] = [{ category: '', subcategory: '', input: '' }];
  public datacategories: any;
  public categories: string[] = [];
  public subcategories: string[] = [];
  public dataCategory: any;
  public dataSubCategory: any;
  idCodeCategory!: number;
  idCodesubcategory!: number;
cat:any
  loadCategories() {

    this.transactionService.getDataCategories().subscribe(
      (data) => {
       
        this.datacategories = data;
        if(this.TcodeCategory){
          const pattern = /^[A-Z0-9]+$/;
          if(pattern.test(this.TcodeCategory)){
            var name=this.datacategories.items.find((item:any) => item.code === this.TcodeCategory).name
            this.cat=name
          }
        }
        const itemsWithEmptyParent = this.datacategories.items.filter((item: any) => item['parent-code'] === '');
        const result = { "items": itemsWithEmptyParent };
        this.categories = result.items.map((item: any) => item.name);
        this.dataCategory = itemsWithEmptyParent

        const itemsWithNonEmptyParent = this.datacategories.items.filter((item: any) => item['parent-code'] !== '');
        this.dataSubCategory = itemsWithNonEmptyParent
      },
      (error) => {
        console.error(error);
      }
    );
  }
  updateSelectedOptionKey(transaction: any): void {
    const searchString = transaction.category;
    var foundObject = this.dataCategory.find((item: any) => item.name === searchString);
    var foundObjects = this.dataSubCategory.filter((item: any) => item['parent-code'] === foundObject.code);
    const result = { "items": foundObjects };
    this.subcategories = result.items.map((item: any) => item.name);
    this.idCodeCategory = foundObject.code
    this.nameCodeCategory = foundObject.name

  }
  onSubcategorySelected(transaction: any): void {
    var foundObject = this.dataSubCategory.find((item: any) => item.name === transaction.value);
    this.idCodesubcategory = foundObject.code

  }


  onOkClick(): void {
    let s;
    let cP;
    if (this.idCodesubcategory && this.idCodeCategory) {
      s = this.idCodesubcategory;
    } else if (this.idCodeCategory) {
      s = this.idCodeCategory;
    }
    cP = this.nameCodeCategory;

    const newObject = {
      idTransaction: this.idTransaction,
      codecat: s,
      codeParent: cP,
      amount: this.numericValue
    };

    const existingData = this.transactionService.getMultipleData('dataCategory');
    const duplicateIndex = existingData.findIndex(item =>
      item.idTransaction === newObject.idTransaction
    );

    if (duplicateIndex === -1) {
      existingData.push(newObject);
    } else {
      // Replace the duplicate object with the new object
      existingData[duplicateIndex] = newObject;
    }

    this.transactionService.setMultipleData('dataCategory', existingData);
    this.dataArray = existingData;
    this.dialogRef.close();
    // location.reload();
  }

  clearAllData(): void {
    this.transactionService.clearAllData();
    this.dataArray = [];
  }

  onCancelClick(): void {
    // this.dataArray = this.transactionService.getMultipleData('dataCategory');
    // this.transactionService.clearAllData();
    this.dataArray = [];
    // console.log(this.dataArray)
    this.dialogRef.close();
  }


}
