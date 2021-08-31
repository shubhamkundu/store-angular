import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IStoreRequest } from '../store/store.interfaces';

export interface IApproveDialogData {
  storeRequest: IStoreRequest;
}

@Component({
  selector: 'store-approve-dialog',
  templateUrl: './approve-dialog.component.html',
  styleUrls: ['./approve-dialog.component.css']
})
export class ApproveDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ApproveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IApproveDialogData
  ) { }

  ngOnInit(): void {
  }

  onClickClose() {
    this.dialogRef.close();
  }

}
