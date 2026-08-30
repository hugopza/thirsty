export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type Table<Row, Insert = Partial<Row>, Update = Partial<Insert>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      comarques: Table<
        { id: number; name: string; slug: string },
        { id?: number; name: string; slug: string }
      >;
      locations: Table<
        { id: number; comarca_id: number; name: string; slug: string },
        { id?: number; comarca_id: number; name: string; slug: string }
      >;
      institutes: Table<
        { id: number; location_id: number; name: string },
        { id?: number; location_id: number; name: string }
      >;
      whatsapp_groups: Table<
        {
          id: number;
          institute_id: number | null;
          location_id: number;
          whatsapp_url: string | null;
        },
        {
          id?: number;
          institute_id?: number | null;
          location_id: number;
          whatsapp_url?: string | null;
        }
      >;
      custom_group_requests: Table<
        {
          approx_people: number;
          created_at: string;
          destination: string;
          id: number;
          name: string;
          phone: string;
        },
        {
          approx_people: number;
          created_at?: string;
          destination: "menorca" | "mallorca" | "ibiza";
          id?: number;
          name: string;
          phone: string;
        }
      >;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
