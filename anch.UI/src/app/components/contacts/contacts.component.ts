import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Contact } from 'src/app/models/contact.model';
import { ContactsService } from 'src/app/services/contacts.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  animate,
  animation,
  keyframes,
  state,
  style,
  transition,
  trigger,
  useAnimation,
} from '@angular/animations';

@UntilDestroy()
@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
  animations: [
    trigger('visibleHidden', [
      state(
        'visible',
        style({
          transform: 'translate(0%, 0%) scale(1)',
          opacity: 1,
        })
      ),
      state(
        'void, hidden',
        style({
          transform: 'translate(-25%, -25%) scale(0.8)',
          opacity: 0,
        })
      ),
      transition('* => visible', animate('500ms')),
      transition('* => void, * => hidden', animate('250ms')),
    ]),
  ],
})
export class ContactsComponent implements OnInit, OnDestroy {
  isVisible = true;
  timerId?: NodeJS.Timeout;
  dataSource: Contact[] = [];
  initialDataSource: Contact[] = [];
  displayedColumns: string[] = [
    'userInfo',
    'jobTitle',
    'organisationUnit',
    'role',
  ];
  roles: Map<string, number> = new Map();
  organizationUnits: Set<string> = new Set();
  jobTitles: Set<string> = new Set();
  filterForm: FormGroup = new FormGroup({
    role: new FormControl(''),
    organisationUnit: new FormControl(''),
    jobTitle: new FormControl(''),
    searchUser: new FormControl(''),
  });

  constructor(private readonly contactsService: ContactsService) {}

  ngOnInit(): void {
    this.initDataSource();

    this.attachToFormValueChanges();
  }

  private initDataSource(): void {
    this.contactsService.getContacts$().subscribe((contacts) => {
      this.initialDataSource = contacts;
      this.dataSource = contacts;
      contacts.forEach((contact) => {
        this.updateRoleCount(contact.role);
        this.organizationUnits.add(contact.organisationUnit);
        this.jobTitles.add(contact.jobTitle);
      });
    });
  }

  private attachToFormValueChanges(): void {
    this.filterForm.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(({ role, organisationUnit, jobTitle, searchUser }) => {
        this.isVisible = false;
        this.resetRolesCount();
        this.dataSource = this.initialDataSource.reduce(
          (newDataSource, contact) => {
            const isUserNameOrEmailMatch =
              (contact.firstName + contact.lastName).includes(searchUser) ||
              contact.email.includes(searchUser);
            const isRoleMatch = !role || contact.role.includes(role);
            const isOrganisationMatch =
              !organisationUnit ||
              contact.organisationUnit.includes(organisationUnit);
            const isJobTitleMatch =
              !jobTitle || contact.jobTitle.includes(jobTitle);

            if (
              isUserNameOrEmailMatch &&
              isRoleMatch &&
              isOrganisationMatch &&
              isJobTitleMatch
            ) {
              this.updateRoleCount(contact.role);
              newDataSource.push(contact);
            }
            return newDataSource;
          },
          [] as Contact[]
        );
        this.timerId = setTimeout(() => (this.isVisible = true), 200);
      });
  }
  toggle(): void {
    this.isVisible = !this.isVisible;
  }
  private resetRolesCount(): void {
    [...this.roles.keys()].forEach((key) => this.roles.set(key, 0));
  }

  private updateRoleCount(role: string): void {
    this.roles.set(role, (this.roles.get(role) ?? 0) + 1);
  }

  ngOnDestroy() {
    if (this.timerId) {
      clearTimeout(this.timerId);
    }
  }
}
