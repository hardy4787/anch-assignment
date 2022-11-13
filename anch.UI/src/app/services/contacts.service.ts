import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Contact } from '../models/contact.model';

@Injectable()
export class ContactsService {
  constructor(private readonly httpClient: HttpClient) {}

  getContacts$(): Observable<Contact[]> {
    return this.httpClient.get<Contact[]>(`${environment.apiUrl}/contacts`);
  }
}
