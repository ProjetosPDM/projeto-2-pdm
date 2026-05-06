export interface SubjectSearch {
  id: string;
  name: string;
  prof: string;
  classes: {
    id: string;
    schedule: string;
    timeStart: string;
    timeEnd: string;
    location: string;
  }[];
}