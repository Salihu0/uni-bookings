export interface Facility {
  id: string;
  name: string;
  location: string;
  capacity: number;
  description?: string;
  amenities?: string[];
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateFacilityDto {
  name: string;
  location: string;
  capacity: number;
  description?: string;
  amenities?: string[];
}

export type UpdateFacilityDto = Partial<CreateFacilityDto>;
