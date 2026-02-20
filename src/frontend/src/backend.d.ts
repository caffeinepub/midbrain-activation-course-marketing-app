import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Marketer {
    principal: Principal;
    name: string;
    referralCount: bigint;
}
export interface Course {
    id: string;
    name: string;
    description: string;
}
export interface StudentApplication {
    contactInfo: string;
    courseSelected: string;
    name: string;
    referredBy?: string;
}
export interface UserProfile {
    name: string;
    role: string;
}
export interface Student {
    principal: Principal;
    name: string;
    enrolledCourses: Array<string>;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    enrollInCourse(courseId: string): Promise<void>;
    getAllCourses(): Promise<Array<Course>>;
    getAllMarketers(): Promise<Array<Marketer>>;
    getAllStudentApplications(): Promise<Array<[bigint, StudentApplication]>>;
    getAllStudents(): Promise<Array<Student>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getEnrolledCourses(studentPrincipal: Principal): Promise<Array<Course>>;
    getMarketerStats(marketerPrincipal: Principal): Promise<[string, bigint]>;
    getStudentApplication(applicationId: bigint): Promise<StudentApplication | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitStudentApplication(application: StudentApplication): Promise<bigint>;
    trackMarketerReferral(): Promise<void>;
    updateMarketerName(newName: string): Promise<void>;
    updateStudentName(newName: string): Promise<void>;
}
