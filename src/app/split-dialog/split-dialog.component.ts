import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { TransactionService } from '../services/transaction.service'
import { flush } from '@angular/core/testing';
@Component({
  selector: 'app-split-dialog',
  templateUrl: './split-dialog.component.html',
  styleUrls: ['./split-dialog.component.scss']
})
export class SplitDialogComponent implements OnInit {
  input1!: number;
  input2!: number;
  item: any;
  stringValue: any;
  numericValue: number;

  idCodeCategory!: number;
  idCodesubcategory!: number;
  nameCodeCategory: any

  public totalAmount!: number;
  public showAmount!: number;
  constructor(
    public dialogRef: MatDialogRef<SplitDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { item: any },
    private transactionService: TransactionService,
  ) {
    this.item = data.item;
    console.log(this.item)
    this.stringValue = this.item.amount;
    this.numericValue = parseFloat(this.stringValue.split('€')[1].trim());
    this.totalAmount = this.numericValue;
    this.showAmount = this.numericValue;
  }


  public transactions: { subcategory: string, input: string }[] = [{ subcategory: '', input: '' }];
  public datacategories: any;
  public categories: string[] = [];
  public subcategories: string[] = [];

  ngOnInit(): void {
    this.loadCategories();
    this.addTransaction();
  }

  public dataCategory: any;
  public dataSubCategory: any;
  loadCategories() {

    //fix porblem treba da najdis za sekoja kategorija da se lista sopstvena pod kategorija
    this.transactionService.getDataCategories().subscribe(
      (data) => {
        this.datacategories = data;
        const itemsWithEmptyParent = this.datacategories.items.filter((item: any) => item['parent-code'] === '');
        const result = { "items": itemsWithEmptyParent };
        this.categories = result.items.map((item: any) => item.name);
        // console.log(itemsWithEmptyParent)
        this.dataCategory = itemsWithEmptyParent
        const itemsWithNonEmptyParent = this.datacategories.items.filter((item: any) => item['parent-code'] !== '');
        // const result2 = {"items": itemsWithNonEmptyParent};
        // this.subcategories = result2.items.map((item: any) => item);
        this.dataSubCategory = itemsWithNonEmptyParent
      },
      (error) => {
        console.error(error);
      }
    );
  }
  myMap = new Map();
  category:any; 
  updateCategory(cate:any){
    const searchString = cate
    var foundObject = this.dataCategory.find((item: any) => item.name === searchString);
    var foundObjects = this.dataSubCategory.filter((item: any) => item['parent-code'] === foundObject.code);
    const result = { "items": foundObjects };
    this.subcategories = result.items.map((item: any) => item.name);
    this.idCodeCategory = foundObject.code
    this.nameCodeCategory = foundObject.name
    console.log(this.idCodeCategory)
  }

  updateSelectedOptionKey(transaction: any, numTrans: any): void {
    const searchString = transaction.category;
    
    var foundObject = this.dataCategory.find((item: any) => item.name === searchString);
    var foundObjects = this.dataSubCategory.filter((item: any) => item['parent-code'] === foundObject.code);
    const result = { "items": foundObjects };
    this.subcategories = result.items.map((item: any) => item.name);
    this.idCodeCategory = foundObject.code
    this.nameCodeCategory = foundObject.name

    console.log(this.idCodeCategory)
    this.myMap.set(numTrans, this.idCodeCategory)

  }
  onSubcategorySelected(transaction: any, numTrans: any): void {
    var foundObject = this.dataCategory.find((item: any) => item.code === this.idCodeCategory);
    
    // console.log(foundObject)
    var foundObjects = this.dataSubCategory.filter((item: any) => item.name === transaction.subcategory);
    const firstObject = foundObjects[0];
    const codeValue = firstObject.code;
    console.log(codeValue)
    this.idCodesubcategory = codeValue
    this.myMap.set(numTrans, this.idCodesubcategory)
  }


  addTransaction() {
    this.transactions.push({ subcategory: '', input: "" });
  }

  onOkClick(): void {

    this.splitTransaction()

  }

  subtractPrecisely(a: number, b: number, precision: number = 2): number {
    const factor = Math.pow(10, precision);
    return Math.round((a - b) * factor) / factor;
  }


  splitTransaction() {
    let tran = false;

    if (!this.transactions || this.transactions.length === 0) {
      console.log("No transactions found.");
      return;
    }

    let total = this.totalAmount;
    console.log("Total amount:", total);

    for (const transaction of this.transactions) {
      const transactionInput = parseFloat(transaction.input);
      console.log("Transaction input:", transactionInput);

      if (transactionInput > 0) {
        total = this.subtractPrecisely(total, transactionInput);
        console.log("Updated total:", total);

        if (total >= 0) {
          if (total === 0) {
            console.log("Transaction successful.");
            tran = true;
          } else {
            console.log("Remaining amount after transaction:", total.toFixed(2));
          }
        } else {
          console.log("Error: Not enough funds for the transaction.");
        }
      }
    }
    console.log("map: " + this.myMap)
    if (tran) {
      let i = 0;
      console.log("map: "+this.myMap)
      for (const transaction of this.transactions) {
        const transactionInput = parseFloat(transaction.input);
        // console.log("map: "+this.myMap)
        i++;
        const myObject = {
          id: this.item.id * 100 + i,
          'beneficiary-name': this.item["beneficiary-name"],
          date: this.item.date,
          direction: this.item.direction,
          amount: '€ ' + transactionInput,
          description: this.item.description,
          currency: this.item.currency,
          mcc: this.item.mcc,
          kind: this.item.kind,
          codeCat: this.myMap.get(i-1),
        };

        console.log(myObject);
        
        const existingData = this.transactionService.getMultipleData('splitData');
        
          existingData.push(myObject);
        
        this.transactionService.setMultipleData('splitData', existingData);
        // this.dataArray = existingData;
        this.dialogRef.close();
        
      }
    }


  }




  onCancelClick(): void {
    this.dialogRef.close();
  }
  onInputChange() {
    if (this.input1) {
      if (this.input1 <= this.numericValue) {
        const subtractedAmount = this.numericValue - this.input1;
        this.input2 = subtractedAmount;
      }
    }

  }



}
