import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from '../model/customer.model';
import { AccountsService } from '../services/accounts.service';
import { custAccounts } from '../model/account.model';
import { Observable, catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-customer-accounts',
  templateUrl: './customer-accounts.component.html',
  styleUrls: ['./customer-accounts.component.css'],
})
export class CustomerAccountsComponent implements OnInit {
  customerId!: string;
  customer!: Customer;
  accountObservable!: custAccounts[];
  errorMessage!: string;
  accounts: Array<custAccounts> = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountsService
  ) {
    this.accounts = this.router.getCurrentNavigation()?.extras
      .state as Array<custAccounts>;
  }

  ngOnInit(): void {
    this.customerId = this.route.snapshot.params['id'];
  }
}
