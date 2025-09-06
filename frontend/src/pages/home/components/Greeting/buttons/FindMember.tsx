import SearchIcon from "src/assets/svg/SearchIcon/SearchIcon"

const FindMember = () => {
    return (
        <div className="bg-at flex rounded-2xl gap-20 w-max pr-60 text-ts font-base">
            <div className="_AddMember-icon flex items-center p-6">
                <SearchIcon color="var(--color-ts)" size={'4rem'}/>
            </div>
            <div className="text-4xl flex items-center box-border p-6">
                Найти участника
            </div>
        </div>
    )
}

export default FindMember