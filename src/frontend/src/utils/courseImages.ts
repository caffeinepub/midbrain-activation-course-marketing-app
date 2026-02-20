// Utility to map course IDs to their corresponding image paths
export const getCourseImage = (courseId: string): string => {
  const imageMap: Record<string, string> = {
    basic: '/assets/generated/basic-intuition.dim_400x300.png',
    advanced: '/assets/generated/advanced-intuition.dim_400x300.png',
    super: '/assets/generated/super-advanced-intuition.dim_400x300.png',
    institution: '/assets/generated/super-advanced-intuition.dim_400x300.png',
    meditation: '/assets/generated/meditation-course.dim_800x600.png',
  };

  return imageMap[courseId] || '/assets/generated/basic-intuition.dim_400x300.png';
};
