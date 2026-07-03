import { useResource } from './useResource';

export function useStudentResource(loader, fallback) {
  return useResource(loader, fallback);
}
