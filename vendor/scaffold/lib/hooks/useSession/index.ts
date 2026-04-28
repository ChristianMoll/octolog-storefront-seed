export default function useSession() {
  return { session: undefined as unknown, isLoggedIn: false, isExpired: false, token: undefined as string | undefined };
}
