import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfigService } from './configuration.service';
import { UserService } from '../services/user.service';
import { StatemanagementService } from '../services/statemanagement.service';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css'],
  providers: [ConfigService],
})
export class ApplicationComponent implements OnInit {
  form: FormGroup;
  formSubmited: boolean = false;
  loader: boolean = false;
  updatePwd: boolean = false;
  configuration;
  clicked;
  columns = [
    { key: 'Username', title: 'Username' },
    { key: 'LoginDate', title: 'Last Login' },
    { key: 'IsActive', title: 'Active' },
  ];

  data = [];

  constructor(private formBuilder: FormBuilder, private userService: UserService, private stateService: StatemanagementService) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      uname: ['', [Validators.required]],
      pwd: ['', [Validators.required, Validators.minLength(3)]],
      cpwd: ['', [Validators.required, Validators.minLength(3)]],
      fname: [''],
      lname: [''],
      phone: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(8)]],
      gender: [''],
      email: ['', [Validators.required, Validators.email]],
      borndate: ['']
    });

    this.configuration = ConfigService.config;
    this.configuration.isLoading = true;
    this.userService.getUser().subscribe(res => {
      this.data = res;
      this.configuration.isLoading = false;
    });

    this.form.get('pwd').disable();
    this.form.get('cpwd').disable();
  }

  eventEmitted($event) {
    this.clicked = JSON.stringify($event, null, 2);
    this.form.patchValue({
      uname: $event.value.row.Username,
      pwd: "xxxxxxxxxx",
      cpwd: "xxxxxxxxxx",
      fname: "",
      lname: "",
      phone: "",
      gender: "",
      email: "",
      borndate: ""
    });
    console.log('$event', $event);
  }

  onSave() {
    this.formSubmited = true;
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    //this.form.disable();
    this.loader = true;
    this.stateService.setTraffic(true);
    let user: any;
    // user = {
    //   Username:this.form.value.uname,
    //   Username:this.form.value.uname,
    // }
    console.log(this.form.value);
    console.log(this.updatePwd);
  }

  chUpdatePwd(e) {
    console.log(this.updatePwd);
    if(this.updatePwd){
      this.form.get('pwd').disable();
      this.form.get('cpwd').disable();
    }else{
      this.form.get('pwd').enable();
      this.form.get('cpwd').enable();
    }
  }
}
