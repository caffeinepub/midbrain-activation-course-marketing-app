import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, Course, Student, Marketer } from '../backend';
import { Principal } from '@dfinity/principal';
import { toast } from 'sonner';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Profile saved successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to save profile: ${error.message}`);
    },
  });
}

// Course Queries
export function useGetAllCourses() {
  const { actor, isFetching } = useActor();

  return useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCourses();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetEnrolledCourses(studentPrincipal?: Principal) {
  const { actor, isFetching } = useActor();

  return useQuery<Course[]>({
    queryKey: ['enrolledCourses', studentPrincipal?.toString()],
    queryFn: async () => {
      if (!actor || !studentPrincipal) return [];
      return actor.getEnrolledCourses(studentPrincipal);
    },
    enabled: !!actor && !isFetching && !!studentPrincipal,
  });
}

export function useEnrollInCourse() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.enrollInCourse(courseId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrolledCourses'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Successfully enrolled in course!');
    },
    onError: (error: Error) => {
      toast.error(`Enrollment failed: ${error.message}`);
    },
  });
}

// Student Queries
export function useGetAllStudents() {
  const { actor, isFetching } = useActor();

  return useQuery<Student[]>({
    queryKey: ['students'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllStudents();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateStudentName() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newName: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateStudentName(newName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Name updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update name: ${error.message}`);
    },
  });
}

// Marketer Queries
export function useGetMarketerStats(marketerPrincipal?: Principal) {
  const { actor, isFetching } = useActor();

  return useQuery<[string, bigint]>({
    queryKey: ['marketerStats', marketerPrincipal?.toString()],
    queryFn: async () => {
      if (!actor || !marketerPrincipal) throw new Error('Actor or principal not available');
      return actor.getMarketerStats(marketerPrincipal);
    },
    enabled: !!actor && !isFetching && !!marketerPrincipal,
  });
}

export function useGetAllMarketers() {
  const { actor, isFetching } = useActor();

  return useQuery<Marketer[]>({
    queryKey: ['marketers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMarketers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useTrackMarketerReferral() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.trackMarketerReferral();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketerStats'] });
      queryClient.invalidateQueries({ queryKey: ['marketers'] });
      toast.success('Referral tracked successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to track referral: ${error.message}`);
    },
  });
}

export function useUpdateMarketerName() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newName: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateMarketerName(newName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketerStats'] });
      queryClient.invalidateQueries({ queryKey: ['marketers'] });
      toast.success('Name updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update name: ${error.message}`);
    },
  });
}
