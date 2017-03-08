import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators} from "@angular/forms";
import { Router } from '@angular/router';

//service pour login
import { UserService } from "../../services/user.service";
//user
import { User } from "../../models/user.model";

@Component({
  selector: 'profile',
  styleUrls: ['profile.component.css'],
  templateUrl: 'profile.component.html'
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  error = "";
  succesMsg = "";
  //edit bool
  editing = false;
  buttonEdit = "";

  constructor(public formBuilder: FormBuilder,
              private router: Router,
              private loginService: UserService,
              private user: User
  ){

    var loggedUser = JSON.parse(localStorage.getItem("loggeduser"));

    user.token = loggedUser && loggedUser.token;
    user.username = loggedUser && loggedUser.username;
    this.buttonEdit = "Éditer le profil";

    //get user
    this.loginService.getUser(user)
      .subscribe(data => {
        this.user.lastname = data.user.lastname;
        this.user.firstname = data.user.firstname;
        this.user.mail = data.user.mail;
      });
  }

  ngOnInit(){

    this.profileForm = this.formBuilder.group({
      lastname: [this.user.lastname, Validators.required],
      firstname: [this.user.firstname, Validators.required],
      username: [this.user.username, Validators.required],
      mail: [this.user.mail, Validators.required]
    });
  }

  onUpdateSubmit(){
    console.log(this.profileForm);
    let formValues = this.profileForm.value;

    if(formValues.lastname)  this.user.lastname = formValues.lastname;
    if(formValues.firstname) this.user.firstname = formValues.firstname;
    if(formValues.username)  this.user.username = formValues.username;
    if(formValues.mail)      this.user.username = formValues.mail;

    this.loginService.updateUser(this.user)
      .subscribe(data => {
          //no edit status
          console.log(data);
          this.editing = false;
          this.buttonEdit = "Éditer le profil";
          this.succesMsg = "Modification effectuée avec succès";
          //update values
          this.user.lastname = data.user.lastname;
          this.user.firstname = data.user.firstname;
          this.user.username = data.user.username;
          this.user.mail = data.user.mail;
        },
        error => {
          this.error = "Modification impossible.";
        });

  }

  onClickEdit(){
    if(this.editing === false){
      this.editing = true;
      this. buttonEdit = "Annuler l'édition";
    } else {
      this.editing = false;
      this.buttonEdit = "Éditer le profil";
    }
  }

}