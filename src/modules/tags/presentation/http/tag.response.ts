import { TagEntity } from '../../domain/entities/tag.entity';

export class TagResponse {
  id: string;
  name: string;

  constructor(tag: TagEntity) {
    this.id = tag.id;
    this.name = tag.name;
  }

  static from(tag: TagEntity): TagResponse {
    return new TagResponse(tag);
  }

  static fromList(tags: TagEntity[]): TagResponse[] {
    return tags.map((tag) => TagResponse.from(tag));
  }
}
