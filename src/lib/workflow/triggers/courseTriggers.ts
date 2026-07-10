import { TriggerHandler } from "../triggerRegistry";

export const courseTriggers: TriggerHandler[] = [
  {
    eventType: "course.enrolled",
    name: "Course Enrollment",
    description: "Fires when a member enrolls in a course",
    payloadSchema: {
      userId: "string",
      courseId: "string",
      courseName: "string",
      enrolledAt: "string",
    },
    async handle(payload) {
      console.log("[Trigger] course.enrolled", payload.data);
    },
  },
  {
    eventType: "course.completed",
    name: "Course Completion",
    description: "Fires when a member completes a course",
    payloadSchema: {
      userId: "string",
      courseId: "string",
      courseName: "string",
      completedAt: "string",
      score: "number",
    },
    async handle(payload) {
      console.log("[Trigger] course.completed", payload.data);
    },
  },
  {
    eventType: "certificate.earned",
    name: "Certificate Earned",
    description: "Fires when a member earns a certificate",
    payloadSchema: {
      userId: "string",
      certificateId: "string",
      courseId: "string",
      courseName: "string",
      earnedAt: "string",
    },
    async handle(payload) {
      console.log("[Trigger] certificate.earned", payload.data);
    },
  },
  {
    eventType: "blog.published",
    name: "Blog Post Published",
    description: "Fires when a new blog post is published",
    payloadSchema: {
      postId: "string",
      title: "string",
      authorId: "string",
      publishedAt: "string",
      category: "string",
    },
    async handle(payload) {
      console.log("[Trigger] blog.published", payload.data);
    },
  },
];
