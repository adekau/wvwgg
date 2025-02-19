export interface IWorld {
  id: number;
  name: string;
  population: 'High' | 'Medium' | 'Low';
  associated_world_id?: number;
}
