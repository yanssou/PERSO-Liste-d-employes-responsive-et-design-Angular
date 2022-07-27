import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

// Interface decrivant les caracteristiques d'un enmploye
export interface DataTableItem {
  id: number;
  employee_name: string;
  employee_salary: number;
  employee_age: number;
  profile_image: string;
}

// Liste des employes
const employes: DataTableItem[] = [
  {id:1,employee_name:"Tiger Nixon",employee_salary:320800,employee_age:61,profile_image:""},
  {id:2,employee_name:"Garrett Winters",employee_salary:170750,employee_age:63,profile_image:""},
  {id:3,employee_name:"Ashton Cox",employee_salary:86000,employee_age:66,profile_image:""},
  {id:4,employee_name:"Cedric Kelly",employee_salary:433060,employee_age:22,profile_image:""},
  {id:5,employee_name:"Airi Satou",employee_salary:162700,employee_age:33,profile_image:""},
  {id:6,employee_name:"Brielle Williamson",employee_salary:372000,employee_age:61,profile_image:""},
  {id:7,employee_name:"Herrod Chandler",employee_salary:137500,employee_age:59,profile_image:""},
  {id:8,employee_name:"Rhona Davidson",employee_salary:327900,employee_age:55,profile_image:""},
  {id:9,employee_name:"Colleen Hurst",employee_salary:205500,employee_age:39,profile_image:""},
  {id:10,employee_name:"Sonya Frost",employee_salary:103600,employee_age:23,profile_image:""},
  {id:11,employee_name:"Jena Gaines",employee_salary:90560,employee_age:30,profile_image:""},
  {id:12,employee_name:"Quinn Flynn",employee_salary:342000,employee_age:22,profile_image:""},
  {id:13,employee_name:"Charde Marshall",employee_salary:470600,employee_age:36,profile_image:""},
  {id:14,employee_name:"Haley Kennedy",employee_salary:313500,employee_age:43,profile_image:""},
  {id:15,employee_name:"Tatyana Fitzpatrick",employee_salary:385750,employee_age:19,profile_image:""},
  {id:16,employee_name:"Michael Silva",employee_salary:198500,employee_age:66,profile_image:""},
  {id:17,employee_name:"Paul Byrd",employee_salary:725000,employee_age:64,profile_image:""},
  {id:18,employee_name:"Gloria Little",employee_salary:237500,employee_age:59,profile_image:""},
  {id:19,employee_name:"Bradley Greer",employee_salary:132000,employee_age:41,profile_image:""},
  {id:20,employee_name:"Dai Rios",employee_salary:217500,employee_age:35,profile_image:""},
  {id:21,employee_name:"Jenette Caldwell",employee_salary:345000,employee_age:30,profile_image:""},
  {id:22,employee_name:"Yuri Berry",employee_salary:675000,employee_age:40,profile_image:""},
  {id:23,employee_name:"Caesar Vance",employee_salary:106450,employee_age:21,profile_image:""},
  {id:24,employee_name:"Doris Wilder",employee_salary:85600,employee_age:23,profile_image:""}
];

/**
 * Data source for the DataTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class DataTableDataSource extends DataSource<DataTableItem> {
  data: DataTableItem[] = employes;
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  constructor() {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<DataTableItem[]> {
    if (this.paginator && this.sort) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return merge(observableOf(this.data), this.paginator.page, this.sort.sortChange)
        .pipe(map(() => {
          return this.getPagedData(this.getSortedData([...this.data ]));
        }));
    } else {
      throw Error('Please set the paginator and sort on the data source before connecting.');
    }
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: DataTableItem[]): DataTableItem[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    } else {
      return data;
    }
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: DataTableItem[]): DataTableItem[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'employee_name': return compare(a.employee_name, b.employee_name, isAsc);
        case 'id': return compare(+a.id, +b.id, isAsc);
        case 'employee_salary': return compare(+a.employee_salary, +b.employee_salary, isAsc);
        case 'employee_age': return compare(+a.employee_age, +b.employee_age, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
