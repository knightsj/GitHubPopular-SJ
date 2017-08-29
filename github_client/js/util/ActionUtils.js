
import RepositoryDetail from '../common/RepositoryDetailPage'
import DataRepository,{FlAG_STORAGE} from '../dao/RepositoryDao'
export default class ActionUtils {

    //跳转到详情页面
    static onSelectRepository(params){
        var {navigator}=params;
        navigator.push({
            component:RepositoryDetail,
            params:{
                ...props
            }
        })
    }

    static onFavorite(favoriteDao,item,isFavorite,flag){
        //写进数据库，使用string
        let key = null;
        if (flag === FlAG_STORAGE.flag_popular){
            key =  item.id.toString();
        }else if (flag === FlAG_STORAGE.flag_trending){
            key = item.fullName;
        }else {
            key = '';
        }
        if(isFavorite){
            favoriteDao.saveFavoriteItem(key,JSON.stringify(item));
        }else {
            favoriteDao.removeFavoriteItem(key);
        }
    }

}