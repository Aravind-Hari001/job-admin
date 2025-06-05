// src/location/location.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';


@Injectable()
export class LocationService {
  constructor(@Inject('PG_POOL') private readonly pool: Pool) {}

  async getLocations() {
    try {
      const result = await this.pool.query('SELECT * FROM locations ORDER BY name ASC');
      return {
        status: true,
        data: result.rows,
        message: 'Locations fetched successfully',
      };
    } catch (error) {      
      return {
        status: false,
        message: `Failed to fetch locations: ${error.message}`,
      };
    }
  }
}

