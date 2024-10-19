import { Post } from "@/lib/types";

export const posts: Post[] = [

    {
        id: '4',
        author: '1 riche 1 pauvre',
        location: 'Paris, champs elisees',
        content: `See the impact of your donations. Our app provides transparency into how your contributions are used, so you can feel confident in your support.`,
        imageUrl: 'https://media.istockphoto.com/id/1996175547/photo/multiracial-group-of-volunteers-packing-groceries-at-community-food-bank.jpg?s=1024x1024&w=is&k=20&c=PBl7DHO5a7FQ3qkbKt1tghRl-Pk3xtYYB3DKQ7CCLH0=',
        likes: 1,
        comments: 4,
        timeAgo: '2 days ago',
    },
    {
        id: '1',
        author: '1 riche 1 pauvre',
        location: 'Paris, champs elisees',
        content: `See the impact of your donations. Our app provides transparency into how your contributions are used, so you can feel confident in your support.`,
        imageUrl: 'https://media.istockphoto.com/id/1162529718/photo/fealing-generous-becous-of-helping-to-other.jpg?s=612x612&w=0&k=20&c=Rq9YrcVlT13KsKolfG-fWjlx3mJVCWhIt1a2AB2m1CU=',
        likes: 1,
        comments: 4,
        timeAgo: 'yesterday',
    },

];

export const API_URL = process.env.EXPO_PUBLIC_PROD_API_URL