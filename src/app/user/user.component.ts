import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfigService } from './configuration.service';
import { UserService } from '../services/user.service';
import { StatemanagementService } from '../services/statemanagement.service';
import { Observable } from 'rxjs/Rx';
import { leftJoin } from 'array-join';
import { SuiModalService, TemplateModalConfig, ModalTemplate } from 'ng2-semantic-ui';
import { User, UserDetail } from '../model';

export interface IContext {
  data: string;
  title: string;
}
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [ConfigService],
})


export class UserComponent implements OnInit {
  loader: boolean = false;
  updatePwd: boolean = false;
  configuration;
  user: User = new User();
  userDetail: UserDetail = new UserDetail();
  columns = [
    { key: 'Username', title: 'Username' },
    { key: 'LoginDate', title: 'Last Login' },
    { key: 'IsActive', title: 'Active' },
    { key: 'Action', title: 'Action' },
  ];
  saved: boolean = false;
  isError: boolean = false;
  message: any = {
    title: "",
    message: ""
  }

  data = [];

  constructor(private userService: UserService, private stateService: StatemanagementService
    , public modalService: SuiModalService) { }
  @ViewChild('modalTemplate')
  public modalTemplate: ModalTemplate<IContext, string, string>
  ngOnInit() {
    this.configuration = ConfigService.config;
    this.reloadData();
  }

  reloadData() {
    this.configuration.isLoading = true;
    this.userService.getUser().subscribe(res => {
      this.data = res;
      this.configuration.isLoading = false;
    });
  }

  showModal() {
    this.open("", "");
  }

  eventEmitted($event) {
    if ($event.event === "onClick") {
      var q = Observable.forkJoin(
        this.userService.getUserUsername($event.value.row.Username),
        this.userService.getUserDetailUsername($event.value.row.Username)
      );

      q.subscribe(res => {
        let a = leftJoin(res[0], res[1], { key: "Username" })[0];
        this.user.Username = a.Username;
        this.user.Password = a.PasswordHash;
        this.user.CPassword = a.PasswordHash;
        this.user.IsActive = a.IsActive == 1 ? true : false;
        this.user.LoginDate = a.LoginDate == null ? Date.now() : a.LoginDate;
        this.user.PasswordHash = a.PasswordHash;
        this.user.PasswordSalt = a.PasswordSalt;

        if (res[1][0])
        {  this.userDetail = res[1][0];
          this.userDetail.Gender = a.Gender == "M"? "<i class='icon male'></i>| Male" : "<i class='icon female'></i>| Female";
        }
        else
          this.userDetail = new UserDetail();
      });

    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  onClear() {
    this.user = new User();
  }

  chUpdatePwd($event) {
    this.updatePwd = $event;
  }

  onSave() {

    if (this.user.Username === "" && this.user.Password === "" && this.user.CPassword === "") {
      this.isError = true;
      this.message.title = "Data Validation";
      this.message.message = "Please fill all required field!";
      return;
    }
    this.loader = true;
    this.userService.getUserUsername(this.user.Username).subscribe(res => {
      if (res.length > 0) //exist
      {
        if (this.updatePwd) {
          this.userService.updateUser(this.user).subscribe(u => {
            this.userService.chPwd(this.user.Username, this.user.Password).subscribe(c => {
              this.saved = true;
              this.loader = false;
              setTimeout(() => {
                this.saved = false;
              }, 4000);
              this.onClear();
              this.reloadData();
            }, err => {
              this.isError = true;
              this.loader = false;
              this.message.title = "Network C";
              this.message.message = "Please try again later";
            });
          }, err => {
            this.isError = true;
            this.loader = false;
            this.message.title = "Network U";
            this.message.message = "Please try again later";
          });
        } else {
          this.user.LoginDate = res[0].LoginDate;
          this.userService.updateUser(this.user).subscribe(u => {
            this.saved = true;
            this.loader = false;
            setTimeout(() => {
              this.saved = false;
            }, 4000);
            this.onClear();
            this.reloadData();
          }, err => {
            this.isError = true;
            this.loader = false;
            this.message.title = "Network C";
            this.message.message = "Please try again later";
          });
        }
      } else { //new user
        let myPassword: string = "";
        if (this.user.CPassword !== this.user.Password) {
          this.isError = true;
          this.message.title = "Data Validation";
          this.message.message = "Unmatched password confirmation!";
          return;
        }

        if (this.user.CPassword === "") {
          this.user.Password = Math.random().toString(36).substr(2, 5);
          myPassword = this.user.Password;
        }

        this.user.username = this.user.Username;
        this.user.password = this.user.Password;
        this.loader = true;

        this.userService.registerUser(this.user).subscribe(res => {
          if (res[0]) {
            this.onClear();
            this.loader = false;
            this.saved = true;
            setTimeout(() => {
              this.saved = false;
            }, 4000);
            if (myPassword !== "") {
              this.isError = true;
              this.message.title = "Password Generated";
              this.message.message = "Password for saved user before " + myPassword + " . Please keep it save.";
              this.loader = false;
            }
            this.reloadData();
          } else {
            this.isError = true;
            this.message.title = "Data Validation";
            this.message.message = res.message;
            this.loader = false;
          }
        }, err => {
          this.isError = true;
          this.message.title = "Data Validation";
          this.message.message = err;
          this.loader = false;
        });
      }
    })


  }

  public open(dynamicContent: string = "Example", title: string = "title") {
    const config = new TemplateModalConfig<IContext, string, string>(this.modalTemplate);

    config.closeResult = "closed!";
    config.context = { data: dynamicContent, title: title };
    config.size = "small";
    config.isClosable = false;


    this.modalService
      .open(config)
      .onApprove(result => {
        if(result === 'approved') this.onSaveDetail();
        if(result === 'deleted') this.onDeleteData();
      })
      .onDeny(result => { /* deny callback */ });
  }

  onSaveDetail() {
    this.userDetail.Username = this.user.Username;
    this.userDetail.Gender = this.userDetail.Gender.split("|")[1].trim();
    this.userService.insertUserDetail(this.userDetail).subscribe(
      res => {
        console.log(res);
        this.reloadData();
      },
      err => {
        console.log(err);
      }
    )
  }

  onDeleteData(){
    this.userService.deleteUser(this.user).subscribe(res => {
      console.log(res);
    })
  }
}
