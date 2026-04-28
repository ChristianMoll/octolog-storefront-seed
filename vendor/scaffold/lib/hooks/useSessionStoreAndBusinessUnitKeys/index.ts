export default function useSessionStoreAndBusinessUnitKeys() {
  return { storeKey: undefined as string | undefined, businessUnitKey: undefined as string | undefined, setStoreKey: (_k: string) => {}, setBusinessUnitKey: (_k: string) => {} };
}
