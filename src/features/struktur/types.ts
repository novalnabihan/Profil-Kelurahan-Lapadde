// src/features/struktur/types.ts

export interface OrgPerson {
  id: string;
  name: string;
  position: string;
  unit: string | null;
  roleCategory: string | null;
  nip?: string | null;
  phone?: string | null;
  photoUrl?: string | null;
  order: number;
}

export interface KasiGroup {
  key: string;
  label: string;
  head: OrgPerson | null;
  staff: OrgPerson[];
}

export interface UnitPendukung {
  label: string;
  person: OrgPerson | null;
}