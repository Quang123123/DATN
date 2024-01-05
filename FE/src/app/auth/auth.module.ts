import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forget-password/forgot-password.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {ReactiveFormsModule} from "@angular/forms";
import {CodeInputModule} from "angular-code-input";


@NgModule({
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
  ],
    imports: [
        CommonModule,
        AuthRoutingModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        ReactiveFormsModule,
        CodeInputModule.forRoot({
        codeLength: 6,
        isCharsCode: false,
        code: ''
      }),
    ]
})
export class AuthModule { }
