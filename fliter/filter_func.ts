import { kenTags } from "@/data/tag";
import { NatureItem } from "@/types/nature";

const getCurrentSeason = () => {
    const now = new Date();
    const month = now.getMonth();
    if (month >= 2 && month <= 4) {
        return 'spring';
    } else if (month >= 5 && month <= 7) {
        return 'summer';
    } else if (month >= 8 && month <= 10) {
        return 'autumn';
    } else {
        return 'winter';
    }
    };

    const filterRecommend = (items: NatureItem[]) => items.filter((item) => item.isRecommend);
    const filterSeason = (items: NatureItem[], season: string) => items.filter((item) => item.season === season);

    const filterRegion = (items: NatureItem[], region: string) => {
        return items.filter(item => 
          item.tags.some(tag => {
            const ken = kenTags.find(k => k.id === tag);
            return ken?.region === region;
          })
        );
      };
      
    
    

export { getCurrentSeason, filterRecommend, filterSeason, filterRegion };