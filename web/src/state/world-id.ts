import { ISuccessResult } from '@worldcoin/idkit';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type WorldIDStore = {
    name: string;
    nameHash: string;
    proof: ISuccessResult;

    reset: () => void;
    setName: (_: string) => void;
    setNameHash: (_: string) => void;
    setProof: (_: ISuccessResult) => void;
};

const useWorldIDStore = create<WorldIDStore>()(
    persist(
        (set) => ({
            name: undefined,
            nameHash: undefined,
            proof: undefined,
            setName: (name) => set({ name }),
            setNameHash: (nameHash) => set({ nameHash }),
            setProof: (proof) => set({ proof }),
            reset: () => set({ proof: undefined, name: undefined }),
        }),
        { name: 'world-id' }
    )
);

export default useWorldIDStore;
