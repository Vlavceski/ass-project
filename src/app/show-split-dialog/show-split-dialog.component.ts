import { Component, OnInit, Inject } from '@angular/core';
import { TransactionService } from '../services/transaction.service'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-show-split-dialog',
  templateUrl: './show-split-dialog.component.html',
  styleUrls: ['./show-split-dialog.component.scss']
})
export class ShowSplitDialogComponent implements OnInit {
  item: any;
  newdata: any[] = []; 

  columnsToDisplay: string[] = ['id', 'beneficiary-name', 'codeCat', 'date', 'amount'];

  constructor(public dialogRef: MatDialogRef<ShowSplitDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { items: any[] },
    private transactionService: TransactionService
  ) {
    this.item = data.items
    this.showData()
  }
  ngOnInit(): void {


  }
  showData() {
    const splitData = this.transactionService.getMultipleData('splitData')
  
    for (const split of splitData) {
      if (split.id === this.item.id &&split['beneficiary-name']==this.item['beneficiary-name']) {
        this.newdata.push(split);
      }
    }
    
  }
  onOkClick() {
    this.dialogRef.close();
  }
}
