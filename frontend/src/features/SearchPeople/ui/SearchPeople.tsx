import SearchIcon from "src/assets/svg/SearchIcon/SearchIcon"

const SearchPeople = () => {
    return (
        <form 
            className="w-full rounded-full bg-accent border-solid border-[3px] border-third-accent box-border p-1 pl-3 pr-3 flex gap-5" 
            onSubmit={e => e.preventDefault()}
        >
            <SearchIcon size={'3.5rem'} color="var(--color-third-accent)"/>
            <input 
                id="PeopleSearch"
                name="PeopleSearch"
                type="text"
                placeholder="..."
                className="text-3xl text-secondary-text font-base flex-1 h-full outline-none"
            />
        </form>
    )
}

export default SearchPeople