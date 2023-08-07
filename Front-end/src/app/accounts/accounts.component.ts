import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AccountsService } from '../services/accounts.service';
import { Observable, catchError, throwError } from 'rxjs';
import { AccountDetails } from '../model/account.model';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {

  accountFormGroup!: FormGroup;
  operationFormGroup!: FormGroup;
  currentPage : number = 0;
  pageSize : number = 5;
  accountObservable! : Observable<AccountDetails>
  errorMessage! : string;

  constructor(private fb : FormBuilder, private accountService : AccountsService){}
  ngOnInit(): void {
    this.accountFormGroup=this.fb.group({
      accountId : this.fb.control('')
    })
    this.operationFormGroup=this.fb.group({
      operationType : this.fb.control(null),
      amount : this.fb.control(0),
      description : this.fb.control(null),
      accountDestination : this.fb.control(null)
    })
  }

  handleSearchAccount(){
    let accountId : string = this.accountFormGroup.value.accountId;
    this.accountObservable =this.accountService.getAccount(accountId,this.currentPage,this.pageSize).pipe(
      catchError(err => {
        this.errorMessage=err.message;
        return throwError(err)
      })
    )
  }

  gotoPage(page : number){
    this.currentPage=page;
    this.handleSearchAccount()
  }
  
  handleAccountOperation(){
    
    
    let accountId : string = this.accountFormGroup.value.accountId;
    let operationType = this.operationFormGroup.value.operationType;
    let amount:number = this.operationFormGroup.value.amount;
    let description:string = this.operationFormGroup.value.description;
    let accountDestination:string = this.operationFormGroup.value.accountDestination;

    if(operationType == 'DEBIT'){
      this.accountService.debit(accountId,amount,description).subscribe({
        next : (data)=>{
          alert("Success Debit")
          this.handleSearchAccount()
          this.operationFormGroup.reset();
        },
        error : (err)=> {
          console.log(err);
          
        }
      })
    }else if(operationType == 'CREDIT'){
      this.accountService.credit(accountId,amount,description).subscribe({
        next : (data)=>{
          alert("Success Credit")
          this.handleSearchAccount()
          this.operationFormGroup.reset();
        },
        error : (err)=> {
          console.log(err);
          
        }
      })
    }else if(operationType == 'TRANSFERT'){
      this.accountService.transfert(accountId,accountDestination,amount).subscribe({
        next : (data)=>{
          alert("Success Transfert")
          this.handleSearchAccount()
          this.operationFormGroup.reset();
        },
        error : (err)=> {
          console.log(err);
          
        }
      })

    }
    
  }

}
