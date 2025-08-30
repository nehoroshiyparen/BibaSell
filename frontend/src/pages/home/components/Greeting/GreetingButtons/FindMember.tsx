import SearchIcon from "src/assets/svg/SearchIcon/SearchIcon"

const FindMember = () => {
    return (
        <div className="bg-third-accent flex rounded-2xl gap-20 w-max pr-60 text-secondary-text font-base">
            <div className="_AddMember-icon flex items-center p-6">
                <SearchIcon color="var(--color-secondary-text)" size={'4rem'}/>
            </div>
            <div className="text-4xl flex items-center box-border p-6">
                Найти участника
            </div>
        </div>
    )
}

export default FindMember