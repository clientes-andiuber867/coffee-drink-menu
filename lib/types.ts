export type Section = {id:string; name:string; description:string; position:number};
export type Product = {id:string; sectionId:string; name:string; description:string; price:number; image:string; portion:string; available:boolean; featured:boolean; position:number};
export type Catalog = {sections:Section[]; products:Product[]};
