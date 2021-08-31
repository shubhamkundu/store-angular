import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IStoreRequest } from '../store/store.interfaces';

export interface IRejectDialogData {
  storeRequest: IStoreRequest;
}

@Component({
  selector: 'store-reject-dialog',
  templateUrl: './reject-dialog.component.html',
  styleUrls: ['./reject-dialog.component.css']
})
export class RejectDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<RejectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IRejectDialogData
  ) { }

  ngOnInit(): void {

  }

  onClickClose() {
    this.dialogRef.close();
  }

  isConfirmDisabled(): boolean {
    return typeof this.data.storeRequest.rejectReason !== 'string' ||
      this.data.storeRequest.rejectReason.trim() === '' ||
      this.data.storeRequest.rejectReason.trim().length < 10;
  }

}
