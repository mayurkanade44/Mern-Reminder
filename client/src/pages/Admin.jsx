import { useAllUsersQuery, useApproveUserMutation } from "../redux/userSlice";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

const Admin = () => {
  const { data, isLoading, refetch } = useAllUsersQuery();
  const [approve, { isLoading: approveLoading }] = useApproveUserMutation();

  const handleApprove = async ({ id, activate }) => {
    try {
      const res = await approve({ userId: id, activate }).unwrap();
      toast.success(res.msg);
      refetch();
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.msg || error.error);
    }
  };

  return (
    <div className="px-6 my-2 w-full">
      {(isLoading || approveLoading) && <Loading />}
      <div className="bg-white px-4 md:px-8 xl:px-10 overflow-x-auto">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="h-16 w-full text-md leading-none text-gray-600">
              <th className="font-bold text-left pl-5">Name</th>
              <th className="font-bold text-left pl-9">Email</th>
              <th className="font-bold text-left">Registration Date</th>
              <th className="font-bold text-left">Approve/Reject</th>
            </tr>
          </thead>
          <tbody className="w-full">
            {data?.map((user) => (
              <tr
                key={user._id}
                className="h-14 text-sm leading-none text-gray-700 border-b border-t border-gray-200 bg-white hover:bg-gray-100"
              >
                <td className="pl-5">
                  <h1>{user.name}</h1>
                </td>
                <td className="mr-16 pl-10">
                  <p>{user.email}</p>
                </td>
                <td>
                  <p className="mr-6">
                    {new Date(user.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </td>
                <td>
                  {user.isVerified ? (
                    <div className="flex gap-1">
                      <p className="bg-green-600 w-20 rounded px-2 py-1.5 text-white">
                        Approved
                      </p>
                      {!user.isAdmin && (
                        <button
                          onClick={() =>
                            handleApprove({ id: user._id, activate: false })
                          }
                          disabled={approveLoading}
                          className="w-full sm:w-auto rounded bg-red-600 text-white px-3 py-1 text-sm hover:bg-indigo-600 disabled:cursor-not-allowed"
                        >
                          Deactivate
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() =>
                        handleApprove({ id: user._id, activate: true })
                      }
                      disabled={approveLoading}
                      className="w-full sm:w-auto rounded bg-red-600 text-white px-3 py-1 text-sm hover:bg-green-600 disabled:cursor-not-allowed"
                    >
                      Pending
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Admin;
