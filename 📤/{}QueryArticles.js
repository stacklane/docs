
import {Article} from '🗄';

const ArticlesByCategory = (category)=>Article.uid_gte(category + '/0').uid_lte(category + '/z');

export {ArticlesByCategory};