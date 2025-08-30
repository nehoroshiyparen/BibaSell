import AddIcon from "src/assets/svg/AddIcon/AddIcon"

const AddMember = () => {
    return (
        <div className="bg-third-accent flex rounded-2xl gap-20 w-max pr-60 text-secondary-text font-base">
            <div className="_AddMember-icon flex items-center p-6">
                <AddIcon size={'4rem'}/>
            </div>
            <div className="text-4xl flex items-center box-border p-6">
                Сохранить участника
            </div>
        </div>
    )
}

export default AddMember