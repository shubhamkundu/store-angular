import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IStoreRequest } from '../store/store.interfaces';

@Component({
  selector: 'store-request-table',
  templateUrl: './request-table.component.html',
  styleUrls: ['./request-table.component.css']
})
export class RequestTableComponent implements OnInit, AfterViewInit {
  @Input() tableType: 'requestor' | 'admin';
  @Input() status: 'pending' | 'approved' | 'rejected';
  @Input() requests: MatTableDataSource<IStoreRequest>;
  @Output() editRequest = new EventEmitter<IStoreRequest>();
  @Output() deleteRequest = new EventEmitter<IStoreRequest>();
  @Output() approveRequest = new EventEmitter<IStoreRequest>();
  @Output() rejectRequest = new EventEmitter<IStoreRequest>();
  displayedColumns: string[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor() { }

  ngOnInit(): void {
    this.displayedColumns = [];
    this.displayedColumns.push('storeName');
    this.displayedColumns.push('location');
    this.displayedColumns.push('phone');
    // this.displayedColumns.push('storeRequestStatus');
    this.displayedColumns.push('storeRequestType');
    this.displayedColumns.push('createdOn');
    if (this.isAdminTable()) {
      this.displayedColumns.push('createdBy');
    }
    if (this.status === 'approved') {
      this.displayedColumns.push('approvedOn');
      this.displayedColumns.push('approvedBy');
    }
    if (this.status === 'rejected') {
      this.displayedColumns.push('rejectedOn');
      this.displayedColumns.push('rejectedBy');
      this.displayedColumns.push('rejectReason');
    }
    if (this.isRequestOpen()) {
      this.displayedColumns.push('actions');
    }
  }

  ngAfterViewInit() {
    this.requests.paginator = this.paginator;
    this.requests.sort = this.sort;
  }

  onClickEdit(request: IStoreRequest) {
    this.editRequest.emit(request);
  }

  onClickDelete(request: IStoreRequest) {
    this.deleteRequest.emit(request);
  }

  onClickApprove(request: IStoreRequest) {
    this.approveRequest.emit(request);
  }

  onClickReject(request: IStoreRequest) {
    this.rejectRequest.emit(request);
  }

  isAdminTable(): boolean {
    return this.tableType === 'admin';
  }

  isRequestOpen(): boolean {
    return this.status === 'pending';
  }

}
