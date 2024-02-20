
import AsyncCard from './async/AsyncCard';
import SyncCard from './sync/SyncCard';
function SearchCard() {
    return (
        <div className='flex flex-col m-10 bg-white pt-10 pb-10 pl-5 pr-5 border-2 rounded-lg border-gray-100 text-gray-400'>
            <AsyncCard />
            <SyncCard />
            
        </div>
    );
}

export default SearchCard;