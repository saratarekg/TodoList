import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, tap} from "rxjs";
import {User} from "../../auth/user.model";
import {Router} from "@angular/router";

interface AuthResponseData{
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject<User | null>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient , private router: Router) { }

  signup(email: string, password:string){
    return this.http
      .post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDBGKNL5SefEi9ZtBKnod8KaEwuW3z8G2A',
      {
        email:email,
        password:password,
        returnSecureToken: true
      }
      )
    .pipe(tap(resData => {
      this.handleAuthentication(resData.email, resData.localId, resData.idToken, resData.expiresIn)
    }))
  }

  login(email: string, password:string){
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDBGKNL5SefEi9ZtBKnod8KaEwuW3z8G2A',
      {
        email:email,
        password:password,
        returnSecureToken: true
      }
    )
      .pipe(tap(resData => {
      this.handleAuthentication(resData.email, resData.localId, resData.idToken, resData.expiresIn)
    }))
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: string
  ){
    const expirationDate = new Date(new Date().getTime() + +expiresIn*1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
    this.autoLogout(Number(expiresIn)*1000)
    localStorage.setItem('userData', JSON.stringify(user));
  }

  logout(){
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if(this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer)
    }
    this.tokenExpirationTimer=null;
  }

  autoLogout(expirationDuration: number){
   this.tokenExpirationTimer= setTimeout(()=>{
      this.logout()
      }, expirationDuration
    );
  }

  autoLogin(){
    const localUser =localStorage.getItem('userData');
    if(!localUser){
      return
    }
    const userData:{
      email:string;
      id:string;
      _token:string;
      _tokenExpirationDate:string
    } = JSON.parse(localUser)

    const loadedUser = new User(userData.email,userData.id,userData._token,new Date(userData._tokenExpirationDate))

    if(loadedUser.token){
      this.user.next(loadedUser);
      const expiryDuration= new Date(userData._tokenExpirationDate).getTime()- new Date().getTime()
      this.autoLogout(expiryDuration)
    }
  }

}
