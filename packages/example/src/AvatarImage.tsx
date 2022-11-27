const AvatarImage = (props: any) => {
  return (
    <img
      src={props.profileImageUrl}
      alt={`${props.fullName} profile`}
      className={props.className}
    />
  );
};

export default AvatarImage;
