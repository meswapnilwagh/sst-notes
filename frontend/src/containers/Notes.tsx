import { API, Storage } from 'aws-amplify';
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import LoaderButton from '../components/LoaderButton';
import config from '../config';
import s3upload from '../lib/awsLib';
import onError from '../lib/errorLib';
import { INote } from './NewNote';

const Notes = () => {
    let file = useRef<File>()
    const { id } = useParams<any>()
    const history = useHistory();
    const [userNote, setUserNote] = useState<INote>();
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    useEffect(() => {
        const loadNote = () => {
            return API.get("notes", `/notes/${id}`, {});
        }

        const onLoad = async () => {
            try {
                const response = await loadNote();
                const { note, attachment } = response;
                if (attachment) {
                    response.attachmentURL = await Storage.vault.get(attachment);
                }
                setContent(note);
                setUserNote(response);
            } catch (error) {
                onError(error);
            }
        }
        onLoad();
    }, [id])

    const validateForm = () => {
        return content.length > 0;
    }

    const formatFileName = (str: string) => {
        return str.replace(/^\w+-/, "");
    }

    const handleFileChange = (event: any) => {
        file.current = event.target?.file;
    }

    const saveNote = async (notePayload: INote) => {
        return API.put("notes", `/notes/${id}`, { body: notePayload });
    }

    const handleSubmit = async (event: FormEvent) => {
        let attachment;
        event.preventDefault();

        if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
            alert("Please upload small file");
            return;
        }

        setIsLoading(true);

        try {
            if (file.current) {
                attachment = await s3upload(file.current);
            }
            await saveNote({
                note: content,
                attachment: attachment || userNote?.attachment!
            })
            history.push("/")
        } catch (error) {

        }
    }

    const deleteNote = () => {
        return API.del("notes", `/notes/${id}`, {});
    }

    const handleDelete = async (event: FormEvent) => {
        event.preventDefault();
        const confirm = window.confirm("Are you sure you want to delete?");
        if (!confirm) { return; }

        setIsDeleting(true);
        try {
            await deleteNote();
            history.push("/");
        } catch (error) {
            onError(error);
            setIsDeleting(false);
        }
    }

    return (
        <div className="Notes">
            {userNote && (
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId='content'>
                        <Form.Control
                            as="textarea"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="file">
                        <Form.Label>Attachment</Form.Label>
                        {userNote.attachment && (
                            <p>
                                <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={userNote.attachmentUrl}
                                >
                                    {formatFileName(userNote.attachment)}
                                </a>
                            </p>
                        )}
                        <Form.Control onChange={handleFileChange} type="file" />
                    </Form.Group>
                    <LoaderButton
                        block
                        size="lg"
                        type="submit"
                        isLoading={isLoading}
                        disabled={!validateForm()}
                    >
                        Save
                    </LoaderButton>
                    <LoaderButton
                        block
                        size="lg"
                        variant="danger"
                        onClick={handleDelete}
                        isLoading={isDeleting}
                    >
                        Delete
                    </LoaderButton>
                </Form>
            )}
        </div>
    );
};

export default Notes;
