import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType({
    description: 'Word object.',
})
export class User {

    @Field(type => ID)
    public id: string;

    @Field({
        description: 'The name of the word.',
    })
    public name: string;

    public email: string;

}
