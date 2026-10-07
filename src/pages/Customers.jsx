import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  UserRound,
  Mail,
  Phone
} from "lucide-react";
import Modal from "../components/common/Modal";
import { useAppContext } from "../context/AppContext";
import "./Customers.css";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");

  const [deleteCustomerId, setDeleteCustomerId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { showToast } = useAppContext();

  useEffect(() => {
    try {
      const savedCustomers =
        JSON.parse(
          localStorage.getItem("travelgo_customers")
        ) || [];

      setCustomers(savedCustomers);
    } catch (error) {
      showToast(
        "Unable to load customers.",
        "error"
      );
    }
  }, [showToast]);

  const openDeleteModal = (id) => {
    setDeleteCustomerId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteCustomerId(null);
    setIsDeleteModalOpen(false);
  };

  const handleDelete = () => {
    try {
      const updatedCustomers = customers.filter(
        (customer) =>
          customer.id !== deleteCustomerId
      );

      setCustomers(updatedCustomers);

      localStorage.setItem(
        "travelgo_customers",
        JSON.stringify(updatedCustomers)
      );

      closeDeleteModal();

      showToast(
        "Customer deleted successfully",
        "success"
      );
    } catch (error) {
      showToast(
        "Unable to delete customer.",
        "error"
      );
    }
  };

  const filteredCustomers = useMemo(() => {
    let result = [...customers];

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();

      result = result.filter(
        (customer) =>
          customer.name
            ?.toLowerCase()
            .includes(search) ||
          customer.email
            ?.toLowerCase()
            .includes(search) ||
          customer.phone
            ?.toLowerCase()
            .includes(search)
      );
    }

    if (statusFilter !== "All") {
      result = result.filter(
        (customer) =>
          customer.status === statusFilter
      );
    }

    if (sortOrder === "newest") {
      result.sort(
        (a, b) =>
          Number(b.id) - Number(a.id)
      );
    }

    if (sortOrder === "oldest") {
      result.sort(
        (a, b) =>
          Number(a.id) - Number(b.id)
      );
    }

    if (sortOrder === "nameAZ") {
      result.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    if (sortOrder === "nameZA") {
      result.sort((a, b) =>
        b.name.localeCompare(a.name)
      );
    }

    return result;
  }, [
    customers,
    searchTerm,
    statusFilter,
    sortOrder
  ]);

  const getInitials = (name) => {
    if (!name) return "CU";

    const words = name.trim().split(" ");

    if (words.length === 1) {
      return words[0]
        .slice(0, 2)
        .toUpperCase();
    }

    return (
      words[0][0] +
      words[words.length - 1][0]
    ).toUpperCase();
  };

  return (
    <div className="customers-page">
      <div className="customers-header">
        <div>
          <h1>Customers</h1>

          <p>
            Manage customer information and travel
            profiles.
          </p>
        </div>

        <Link
          to="/customers/create"
          className="create-customer-btn"
        >
          <Plus size={18} />
          Add Customer
        </Link>
      </div>

      <div className="customers-toolbar">
        <div className="customer-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />
        </div>

        <div className="customer-filter">
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
          >
            <option value="All">
              All Status
            </option>

            <option value="Active">
              Active
            </option>

            <option value="Inactive">
              Inactive
            </option>
          </select>
        </div>

        <div className="customer-filter">
          <select
            value={sortOrder}
            onChange={(event) =>
              setSortOrder(event.target.value)
            }
          >
            <option value="newest">
              Newest First
            </option>

            <option value="oldest">
              Oldest First
            </option>

            <option value="nameAZ">
              Name: A to Z
            </option>

            <option value="nameZA">
              Name: Z to A
            </option>
          </select>
        </div>
      </div>

      <div className="customers-card">
        <div className="customers-card-header">
          <div>
            <h2>All Customers</h2>

            <span>
              {filteredCustomers.length} customer
              {filteredCustomers.length !== 1
                ? "s"
                : ""}
            </span>
          </div>
        </div>

        {filteredCustomers.length === 0 ? (
          <div className="customers-empty">
            <div className="customer-empty-icon">
              <UserRound size={28} />
            </div>

            <h3>No customers found</h3>

            <p>
              {customers.length === 0
                ? "Add your first customer to get started."
                : "Try changing your search or filter."}
            </p>

            {customers.length === 0 && (
              <Link
                to="/customers/create"
                className="empty-customer-btn"
              >
                <Plus size={17} />
                Add Customer
              </Link>
            )}
          </div>
        ) : (
          <div className="customers-table-wrapper">
            <table className="customers-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Country</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredCustomers.map(
                  (customer) => (
                    <tr key={customer.id}>
                      <td>
                        <div className="customer-info">
                          <div className="customer-avatar">
                            {customer.image ? (
                              <img
                                src={customer.image}
                                alt={customer.name}
                              />
                            ) : (
                              getInitials(
                                customer.name
                              )
                            )}
                          </div>

                          <div>
                            <h3>
                              {customer.name}
                            </h3>

                            <span>
                              Customer #
                              {String(
                                customer.id
                              ).slice(-5)}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="customer-contact">
                          <div>
                            <Mail size={14} />
                            <span>
                              {customer.email}
                            </span>
                          </div>

                          <div>
                            <Phone size={14} />
                            <span>
                              {customer.phone}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="customer-country">
                          {customer.country || "-"}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`customer-status ${
                            customer.status?.toLowerCase()
                          }`}
                        >
                          {customer.status}
                        </span>
                      </td>

                      <td>
                        <div className="customer-actions">
                          <Link
                            to={`/customers/${customer.id}`}
                            className="customer-action view"
                            title="View Customer"
                          >
                            <Eye size={16} />
                          </Link>

                          <Link
                            to={`/customers/${customer.id}/edit`}
                            className="customer-action edit"
                            title="Edit Customer"
                          >
                            <Pencil size={16} />
                          </Link>

                          <button
                            type="button"
                            className="customer-action delete"
                            title="Delete Customer"
                            onClick={() =>
                              openDeleteModal(
                                customer.id
                              )
                            }
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        title="Delete Customer?"
        message="Are you sure you want to delete this customer? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={closeDeleteModal}
        confirmText="Delete Customer"
        cancelText="Keep Customer"
      />
    </div>
  );
}

export default Customers;