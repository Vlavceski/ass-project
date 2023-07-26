import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(
    private http: HttpClient

  ) { }


  public getData(): Observable<any> {
    const url = 'http://127.0.0.1:4010/transactions?page=157&page-size=160&sort-by=minima&sort-order=asc';
    return this.http.get<any>(url);
  }
  public getDataCategories(): Observable<any> {
    const url = 'http://127.0.0.1:4010/categories';
    return this.http.get<any>(url);
  }
  public postTransactionSplit(id: any, requestBody: any): Observable<any> {
    const url = `http://127.0.0.1:4010/transaction/${id}/split`;
    console.log(url)
    return this.http.post(url, requestBody);
  }



  //localStorage
  public clearAllData(): void {
    localStorage.clear();
  }

  public setMultipleData(key: string, dataArray: any[]): void {
    localStorage.setItem(key, JSON.stringify(dataArray));
  }

  public getMultipleData(key: string): any[] {
    const dataArrayString = localStorage.getItem(key);
    return dataArrayString ? JSON.parse(dataArrayString) : [];
  }
  
  public clearSplitData(key:string): void {
    localStorage.removeItem(key);
  }
}
