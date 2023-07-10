import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../services/customer.service';
import { Observable, catchError, throwError } from 'rxjs';
import { Customer } from '../model/customer.model';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  customers !: Observable<Array<Customer>>;
  errorMessage!:String;
  searchFormGroup!: FormGroup;

  constructor(private customerService: CustomerService, private fb : FormBuilder){}

  ngOnInit(): void {

    this.searchFormGroup=this.fb.group({
      keyword : this.fb.control("")
    })

    this.handleSearchCustomers();
  }

  handleSearchCustomers(){
    let kw=this.searchFormGroup?.value.keyword;
    this.customers=this.customerService.searchCustomers(kw).pipe(
      catchError(err =>{
        this.errorMessage=err.message;
        return throwError(()=>err);
      })
    );
  }
}
