import AddIcon from "src/shared/ui/svg/AddIcon/AddIcon"

const AddMember = () => {
    return (
        <div className="bg-[#dbbc83] flex rounded-2xl gap-20 w-max pr-60 text-[#ffffff]">
            <div className="_AddMember-icon flex items-center p-8">
                <AddIcon size={'5rem'}/>
            </div>
            <div className="text-6xl flex items-center box-border p-8">
                Сохранить участника
            </div>
        </div>
    )
}

export default AddMember