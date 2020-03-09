import { MerchantCatalogDto } from './merchantCatalogDto';

export class InsetMerchantCatalogDto
{
    merchantID:number;
    type:string;
    MerchantCatalog:MerchantCatalogDto[];
}