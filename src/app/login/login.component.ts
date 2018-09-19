import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { StatemanagementService } from '../services/statemanagement.service';
import { SuiModalService, TemplateModalConfig, ModalTemplate } from 'ng2-semantic-ui';
import { Router, ActivatedRoute } from '@angular/router';

export interface IContext {
  data: string;
  title:string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  formSubmited: boolean = false;
  loader:boolean =false;
  returnUrl: string;
  constructor(private router: Router, private route: ActivatedRoute,
    private formBuilder: FormBuilder, private loginService: LoginService
    , private stateService: StatemanagementService, public modalService: SuiModalService) { }
  
  @ViewChild('modalTemplate')
  public modalTemplate: ModalTemplate<IContext, string, string>
  ngOnInit() {
    if (localStorage.getItem('currentUser')) {
      this.router.navigate(['/']);
    }
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.form = this.formBuilder.group({
      uname: ['', [Validators.required]],
      pwd: ['', [Validators.required, Validators.minLength(3)]]
    });


  }

  onSubmit() {
    this.formSubmited = true;
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    this.form.disable();
    this.loader = true;
    this.stateService.setTraffic(true);
    this.loginService.login(this.form.value.uname, this.form.value.pwd)
      .subscribe(res => {
        if(res){
          this.router.navigate(['/main/landing']);
          this.loader = false;
          this.form.enable();
        }
      },
        err => {
          this.loader = false;
          this.form.enable();
          this.stateService.setTraffic(false);
          this.open("Username or password are not match!", "Information");
          this.loginService.logout();
        }
      );
  }

  public open(dynamicContent: string = "Example", title:string = "title") {
    const config = new TemplateModalConfig<IContext, string, string>(this.modalTemplate);

    config.closeResult = "closed!";
    config.context = { data: dynamicContent, title: title };
    config.size = "mini";

    this.modalService
      .open(config)
      .onApprove(result => { /* approve callback */ })
      .onDeny(result => { /* deny callback */ });
  }

}
