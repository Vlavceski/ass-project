import { Component, OnInit, Inject } from '@angular/core';
import { TransactionService } from '../services/transaction.service'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-multi-cate-dialog',
  templateUrl: './multi-cate-dialog.component.html',
  styleUrls: ['./multi-cate-dialog.component.scss']
})
export class MultiCateDialogComponent implements OnInit {

  items: any[];

  idTransactions!: any;

  

  constructor(
    public dialogRef: MatDialogRef<MultiCateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { items: any[] },
    private transactionService: TransactionService
  ) {
    this.items = data.items;
    this.idTransactions = this.items
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  numberTransaction(): number {
    return this.items.length;
  }

  //categories
  public transactions: { category: string, subcategory: string, input: string }[] = [{ category: '', subcategory: '', input: '' }];
  public datacategories: any;
  public categories: string[] = [];
  public subcategories: string[] = [];
  public dataCategory: any;
  public dataSubCategory: any;

  loadCategories() {

    this.transactionService.getDataCategories().subscribe(
      (data) => {
        this.datacategories = data;
        const itemsWithEmptyParent = this.datacategories.items.filter((item: any) => item['parent-code'] === '');
        const result = { "items": itemsWithEmptyParent };
        this.categories = result.items.map((item: any) => item.name);
        console.log(itemsWithEmptyParent)
        this.dataCategory = itemsWithEmptyParent
        const itemsWithNonEmptyParent = this.datacategories.items.filter((item: any) => item['parent-code'] !== '');
        this.dataSubCategory = itemsWithNonEmptyParent

      },
      (error) => {
        console.error(error);
      }
    );
  }
  nameCodeCategory:any
  updateSelectedOptionKey(transaction: any): void {
    const searchString = transaction.category;
    var foundObject = this.dataCategory.find((item: any) => item.name === searchString);
    var foundObjects = this.dataSubCategory.filter((item: any) => item['parent-code'] === foundObject.code);
    const result = { "items": foundObjects };

    this.subcategories = result.items.map((item: any) => item.name);
    console.log(this.subcategories)

    this.idCodeCategory = foundObject.code
    this.nameCodeCategory=foundObject.name

  }
  onSubcategorySelected(transaction: any): void {
    var foundObject = this.dataSubCategory.find((item: any) => item.name === transaction);
    console.log(foundObject)
    this.idCodesubcategory = foundObject.code

  }

  dataArray!: any[];
  idCodeCategory!: number;
  idCodesubcategory!: number;

  onOkClick(): void {
    var s: number | null=null;
    var cP: number | null=null;
    if (this.idCodesubcategory && this.idCodeCategory) {
      s = this.idCodesubcategory;
    } else{
      s = this.idCodeCategory;
    }
    cP=this.nameCodeCategory;


    if (s === null) {
      console.error("Subcategory or Category not selected.");
      return;
    }
    console.log(this.idTransactions)

    // const idTransactionsArray = this.idTransactions.map((item: any) => item.id);
    const idTransactionsArray = this.idTransactions.map((item: any) => ({
      id: item.id,
      amount: item.amount,
    }));
    console.log("trans");
    console.log(idTransactionsArray);
    
    const existingData = this.transactionService.getMultipleData('dataCategory') ;

    const newObjects = idTransactionsArray.map((idTransaction: any) => {
      return {
        idTransaction: idTransaction.id,
        codecat: s,
        codeParent:cP,
        amount:parseFloat(idTransaction.amount.split('€')[1].trim()),

      };
    });
    for (const newDataItem of newObjects) {
      const index = existingData.findIndex((dataItem) => dataItem.idTransaction === newDataItem.idTransaction);
      if (index !== -1) {
        existingData[index].codecat = newDataItem.codecat;
      }
    }
    // Filter out duplicates based on idTransaction
    const uniqueNewObjects = newObjects.filter((newObj:any) => {
      return !existingData.some((existingObj) => existingObj.idTransaction === newObj.idTransaction);
    });

    // Add the unique newObjects to existingData
    existingData.push(...uniqueNewObjects);

    this.transactionService.setMultipleData('dataCategory', existingData);
    this.dataArray = existingData;
    this.dialogRef.close();
  }

  onCancelClick(): void {
    // Perform actions when Cancel button is clicked
    this.dialogRef.close();
  }


}
