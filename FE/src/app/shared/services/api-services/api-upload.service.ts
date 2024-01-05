import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApiConstant} from "../../constants/api-constant";

@Injectable({
  providedIn: 'root'
})
export class ApiUploadService{

  constructor(private httpClient:HttpClient) {
  }

  uploadImage(data:any, folder:string):Observable<any>{
    return this.httpClient.post(`${ApiConstant.uploadImage}/${folder}`, data);
  }

  upLoadImageDetail(data : any, folder:string):Observable<any>{
    return this.httpClient.post(`${ApiConstant.uploadImage}/detail/${folder}`, data);
  }

  uploadImageClient(data : any, folder:string):Observable<any>{
    return this.httpClient.post(`${ApiConstant.uploadImage}/client/${folder}`, data);
  }

  upLoadImageDetailClient(data : any, folder:string):Observable<any>{
    return this.httpClient.post(`${ApiConstant.uploadImage}/client/detail/${folder}`, data);
  }
}
