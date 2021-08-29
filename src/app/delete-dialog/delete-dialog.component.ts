import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface IDeleteDialogData {
  deleteSubject: string;
}

@Component({
  selector: 'store-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.css']
})
export class DeleteDialogComponent implements OnInit, OnDestroy {

  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDeleteDialogData
  ) { }

  ngOnInit(): void {
  }

  onClickClose() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.onClickClose();
  }

}
