import { Customer } from './../model/customer.model';
import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../services/customer.service';
import { Observable, catchError, map, throwError } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { custAccounts } from '../model/account.model';
import { AccountsService } from '../services/accounts.service';


@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css'],
})
export class CustomersComponent implements OnInit {
  customers!: Observable<Array<Customer>>;
  errorMessage!: String;
  searchFormGroup!: FormGroup;
  accountObservable!: custAccounts[];

  constructor(
    private customerService: CustomerService,
    private fb: FormBuilder,
    private router: Router,
    private accountService: AccountsService
  ) {}

  ngOnInit(): void {
    this.searchFormGroup = this.fb.group({
      keyword: this.fb.control(''),
    });

    this.handleSearchCustomers();
  }

  handleSearchCustomers() {
    let kw = this.searchFormGroup?.value.keyword;
    this.customers = this.customerService.searchCustomers(kw).pipe(
      catchError((err) => {
        this.errorMessage = err.message;
        return throwError(() => err);
      })
    );
  }

  handleDeleteCustomer(c: Customer) {
    let conf = confirm('Are you sure ?');
    if (!conf) return;
    this.customerService.deleteCustomer(c.id).subscribe({
      next: (data) => {
        this.customers = this.customers.pipe(
          map((data) => {
            let index = data.indexOf(c);
            data.slice(index, 1);
            return data;
          })
        );
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  handleCustomerAccounts(customer: Customer) {
    this.accountService.getAccounts(customer.id.toString()).subscribe(
      (data) => {
        this.accountObservable = data;
        console.log('Response:', data);
        this.router.navigateByUrl('customer-accounts/' + customer.id, {
          state: data,
        });
      },
      (error: any) => {
        console.error('Error fetching accounts:', error);
      }
    );
  }
}
